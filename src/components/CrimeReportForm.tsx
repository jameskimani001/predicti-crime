
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CalendarIcon, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { useCrimeData } from '@/contexts/CrimeDataContext';
import { toast } from '@/components/ui/use-toast';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

const formSchema = z.object({
  type: z.string().min(1, { message: 'Please select the type of crime' }),
  address: z.string().min(5, { message: 'Please provide a detailed address' }),
  datetime: z.date({ required_error: 'Please select a date and time' }),
  description: z.string().min(10, { message: 'Please provide a description of at least 10 characters' }),
  severity: z.enum(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'], {
    required_error: 'Please rate the severity',
  }),
  witness: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CrimeReportForm: React.FC = () => {
  const { submitCrimeReport } = useCrimeData();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: '',
      address: '',
      description: '',
      severity: '5',
      witness: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await submitCrimeReport({
        type: data.type,
        location: {
          address: data.address,
          lat: -1.2864, // Default to Nairobi coordinates
          lng: 36.8172,
        },
        datetime: data.datetime.toISOString(),
        description: data.description,
        severity: parseInt(data.severity),
        witness: data.witness,
      });

      form.reset();
      
      toast({
        title: "Report Submitted",
        description: "Your crime report has been submitted successfully. Thank you for contributing to community safety.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error submitting your report. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Crime Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crime type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Robbery">Robbery</SelectItem>
                    <SelectItem value="Assault">Assault</SelectItem>
                    <SelectItem value="Theft">Theft</SelectItem>
                    <SelectItem value="Carjacking">Carjacking</SelectItem>
                    <SelectItem value="Fraud">Fraud</SelectItem>
                    <SelectItem value="Burglary">Burglary</SelectItem>
                    <SelectItem value="Vandalism">Vandalism</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="severity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Severity (1-10)</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Rate severity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} - {num <= 3 ? 'Low' : num <= 7 ? 'Medium' : 'High'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Rate how severe the crime was (10 being most severe)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="datetime"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date and Time</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? format(field.value, "PPP") : "Select date"}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Select the date when the crime occurred
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Enter the address where the crime occurred" 
                    className="pl-10" 
                    {...field} 
                  />
                </div>
              </FormControl>
              <FormDescription>
                Please provide a specific address or location description
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe what happened in detail" 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Provide as much detail as possible about the incident
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="witness"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Witness Information (Optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Provide your contact information if you're willing to be contacted" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                This is optional. You can report anonymously.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">Submit Crime Report</Button>
      </form>
    </Form>
  );
};

export default CrimeReportForm;
